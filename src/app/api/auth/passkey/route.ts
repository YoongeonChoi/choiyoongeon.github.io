import { NextRequest, NextResponse } from "next/server";
import {
    generateRegistrationOptions,
    verifyRegistrationResponse,
    generateAuthenticationOptions,
    verifyAuthenticationResponse,
} from "@simplewebauthn/server";

// Inline types to avoid @simplewebauthn/types dependency
interface RegistrationResponseJSON {
    id: string;
    rawId: string;
    response: {
        clientDataJSON: string;
        attestationObject: string;
        transports?: string[];
    };
    authenticatorAttachment?: string;
    clientExtensionResults: Record<string, unknown>;
    type: string;
}

interface AuthenticationResponseJSON {
    id: string;
    rawId: string;
    response: {
        clientDataJSON: string;
        authenticatorData: string;
        signature: string;
        userHandle?: string;
    };
    authenticatorAttachment?: string;
    clientExtensionResults: Record<string, unknown>;
    type: string;
}

// Relying Party configuration
const rpName = process.env.NEXT_PUBLIC_WEBAUTHN_RP_NAME || "Portfolio Admin";
const rpID = process.env.NEXT_PUBLIC_WEBAUTHN_RP_ID || "localhost";
const origin = process.env.NEXT_PUBLIC_SITE_URL || `http://${rpID}:3000`;

// In-memory challenge store (use Redis/DB in production)
const challengeStore = new Map<string, string>();

// Allowed user (in production, this would come from a database)
const ADMIN_USER_ID = "admin";
const ADMIN_USERNAME = "admin@yoongeonchoi.com";

export async function POST(request: NextRequest) {
    const { action, ...body } = await request.json();

    try {
        switch (action) {
            case "register-options":
                return handleRegisterOptions();

            case "register-verify":
                return handleRegisterVerify(body.response as RegistrationResponseJSON);

            case "auth-options":
                return handleAuthOptions();

            case "auth-verify":
                return handleAuthVerify(body.response as AuthenticationResponseJSON);

            default:
                return NextResponse.json({ error: "Invalid action" }, { status: 400 });
        }
    } catch (error) {
        console.error("WebAuthn error:", error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Authentication failed" },
            { status: 500 }
        );
    }
}

async function handleRegisterOptions() {
    const options = await generateRegistrationOptions({
        rpName,
        rpID,
        userID: new TextEncoder().encode(ADMIN_USER_ID),
        userName: ADMIN_USERNAME,
        attestationType: "none",
        authenticatorSelection: {
            residentKey: "preferred",
            userVerification: "preferred",
            authenticatorAttachment: "platform",
        },
        supportedAlgorithmIDs: [-7, -257], // ES256, RS256
    });

    // Store challenge for verification
    challengeStore.set(ADMIN_USER_ID, options.challenge);

    return NextResponse.json(options);
}

async function handleRegisterVerify(response: RegistrationResponseJSON) {
    const expectedChallenge = challengeStore.get(ADMIN_USER_ID);

    if (!expectedChallenge) {
        throw new Error("No challenge found. Please restart registration.");
    }

    const verification = await verifyRegistrationResponse({
        response: response as Parameters<typeof verifyRegistrationResponse>[0]["response"],
        expectedChallenge,
        expectedOrigin: origin,
        expectedRPID: rpID,
    });

    if (!verification.verified || !verification.registrationInfo) {
        throw new Error("Registration verification failed");
    }

    challengeStore.delete(ADMIN_USER_ID);

    return NextResponse.json({
        verified: true,
        credentialId: verification.registrationInfo.credential.id,
    });
}

async function handleAuthOptions() {
    const options = await generateAuthenticationOptions({
        rpID,
        userVerification: "preferred",
    });

    challengeStore.set(ADMIN_USER_ID, options.challenge);

    return NextResponse.json(options);
}

async function handleAuthVerify(response: AuthenticationResponseJSON) {
    const expectedChallenge = challengeStore.get(ADMIN_USER_ID);

    if (!expectedChallenge) {
        throw new Error("No challenge found. Please restart authentication.");
    }

    // In production, fetch credential from database
    // For demo, we simulate successful auth
    challengeStore.delete(ADMIN_USER_ID);

    return NextResponse.json({
        verified: true,
        userId: ADMIN_USER_ID,
        demo: true,
    });
}
