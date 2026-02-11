import { z } from "zod";

/**
 * Zod schemas for input validation and hydration safety.
 * Used to validate all data coming from Supabase before rendering.
 */

// ─── Blog Post Schema ───
export const BlogPostSchema = z.object({
    id: z.string().uuid(),
    author_id: z.string().uuid(),
    category_id: z.string().uuid().nullable(),
    title: z.string().min(1).max(200),
    slug: z.string().min(1).max(200).regex(/^[a-z0-9-]+$/),
    excerpt: z.string().max(500).nullable(),
    content_mdx: z.string(),
    cover_image_url: z.string().url().nullable(),
    tags: z.array(z.string()),
    is_published: z.boolean(),
    reading_time_minutes: z.number().int().nonnegative(),
    published_at: z.string().nullable(),
    created_at: z.string(),
    updated_at: z.string(),
});

export type ValidatedBlogPost = z.infer<typeof BlogPostSchema>;

// ─── Category Schema ───
export const CategorySchema = z.object({
    id: z.string().uuid(),
    name: z.string().min(1).max(100),
    slug: z.string().min(1).max(100).regex(/^[a-z0-9-]+$/),
    description: z.string().max(300).nullable(),
    color_hex: z.string().regex(/^#[0-9a-fA-F]{6}$/).nullable(),
    sort_order: z.number().int(),
    created_at: z.string(),
});

export type ValidatedCategory = z.infer<typeof CategorySchema>;

// ─── Profile Schema ───
export const ProfileSchema = z.object({
    id: z.string().uuid(),
    display_name: z.string().min(1).max(100),
    bio: z.string().max(1000).nullable(),
    avatar_url: z.string().url().nullable(),
    github_username: z.string().max(39).nullable(),
    social_links: z.record(z.string(), z.string().url()).nullable(),
    created_at: z.string(),
    updated_at: z.string(),
});

export type ValidatedProfile = z.infer<typeof ProfileSchema>;

// ─── GitHub Contributions Schema ───
export const ContributionDaySchema = z.object({
    date: z.string(),
    contributionCount: z.number().int().nonnegative(),
    contributionLevel: z.enum([
        "NONE",
        "FIRST_QUARTILE",
        "SECOND_QUARTILE",
        "THIRD_QUARTILE",
        "FOURTH_QUARTILE",
    ]),
});

export const ContributionWeekSchema = z.object({
    contributionDays: z.array(ContributionDaySchema),
});

export const ContributionsResponseSchema = z.object({
    weeks: z.array(ContributionWeekSchema),
    totalContributions: z.number().int().nonnegative(),
});

export type ContributionDay = z.infer<typeof ContributionDaySchema>;
export type ContributionWeek = z.infer<typeof ContributionWeekSchema>;
export type ContributionsResponse = z.infer<typeof ContributionsResponseSchema>;
