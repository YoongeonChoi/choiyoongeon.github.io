"use client";

import { motion } from "framer-motion";
import { useState, useCallback } from "react";
import { Header } from "@/components/navigation/Header";
import { springs } from "@/lib/motion/config";
import { supabase } from "@/lib/supabase/client";

export default function WritePage() {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [category, setCategory] = useState("Development");
    const [tags, setTags] = useState<string[]>([]);
    const [tagInput, setTagInput] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;

        const file = e.target.files[0];
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `public/${fileName}`;

        setIsUploading(true);

        try {
            const { error: uploadError } = await supabase.storage
                .from('content')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('content')
                .getPublicUrl(filePath);

            // Insert markdown image at cursor position or append
            const imageMarkdown = `\n![${file.name}](${publicUrl})\n`;
            setContent(prev => prev + imageMarkdown);

            alert("Image uploaded successfully!");
        } catch (error) {
            console.error('Error uploading image:', error);
            alert('Failed to upload image');
        } finally {
            setIsUploading(false);
        }
    };

    const handleAddTag = useCallback(() => {
        if (tagInput.trim() && !tags.includes(tagInput.trim())) {
            setTags([...tags, tagInput.trim()]);
            setTagInput("");
        }
    }, [tagInput, tags]);

    const handleRemoveTag = useCallback((tagToRemove: string) => {
        setTags(tags.filter((tag) => tag !== tagToRemove));
    }, [tags]);

    const handleSave = async (publish: boolean = false) => {
        setIsSaving(true);

        try {
            // Generate basic slug from title if new
            const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

            // Upsert post (update if slug exists, else insert - simplified for demo, robust would check ID)
            const { error } = await supabase.from("posts").upsert({
                title,
                slug, // In production, allow slug editing to avoid overwrites or conflicts
                content,
                category,
                tags,
                published: publish,
                published_at: publish ? new Date().toISOString() : null,
                updated_at: new Date().toISOString()
            } as any, { onConflict: 'slug' });

            if (error) throw error;

            alert(publish ? "Post published!" : "Draft saved!");
        } catch (err) {
            console.error(err);
            alert("Failed to save post");
        } finally {
            setIsSaving(false);
        }
    };

    // Simple markdown preview
    const renderPreview = (text: string) => {
        return text
            .replace(/^## (.+)$/gm, '<h2 class="text-xl font-bold mt-6 mb-3">$1</h2>')
            .replace(/^### (.+)$/gm, '<h3 class="text-lg font-semibold mt-4 mb-2">$1</h3>')
            .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
            .replace(/\*([^*]+)\*/g, '<em>$1</em>')
            .replace(/`([^`]+)`/g, '<code class="bg-surface-elevated px-1 rounded text-accent-primary">$1</code>')
            .replace(/\n\n/g, '</p><p class="mb-4">')
            .replace(/^/g, '<p class="mb-4">')
            .replace(/$/g, '</p>');
    };

    return (
        <>
            <Header />
            <main id="main-content" className="min-h-screen pt-20 pb-8">
                <div className="max-w-7xl mx-auto px-6">
                    {/* Top Actions */}
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={springs.smooth}
                        className="flex items-center justify-between py-4 border-b border-border-subtle mb-6"
                    >
                        <a
                            href="/admin"
                            className="flex items-center gap-2 text-text-muted hover:text-text-primary transition-colors"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            Back to Dashboard
                        </a>

                        <div className="flex items-center gap-3">
                            <motion.button
                                onClick={() => handleSave(false)}
                                disabled={isSaving}
                                className="px-4 py-2 rounded-lg bg-surface-secondary text-text-secondary hover:text-text-primary transition-colors disabled:opacity-50"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                Save Draft
                            </motion.button>
                            <motion.button
                                onClick={() => handleSave(true)}
                                disabled={isSaving || !title || !content}
                                className="px-4 py-2 rounded-lg bg-accent-primary text-surface-primary font-medium hover:glow-accent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                {isSaving ? "Saving..." : "Publish"}
                            </motion.button>
                        </div>
                    </motion.div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Editor */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={springs.smooth}
                            className="space-y-4"
                        >
                            <h2 className="font-display font-semibold text-text-primary">Editor</h2>

                            {/* Title */}
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Post Title"
                                className="w-full px-4 py-3 rounded-xl bg-surface-secondary border border-border-subtle text-2xl font-display text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-primary transition-colors"
                            />

                            {/* Category */}
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl bg-surface-secondary border border-border-subtle text-text-primary focus:outline-none focus:border-accent-primary transition-colors"
                            >
                                <option value="Development">Development</option>
                                <option value="Design">Design</option>
                                <option value="Security">Security</option>
                                <option value="Career">Career</option>
                            </select>

                            {/* Image Upload */}
                            <div className="flex items-center gap-4 p-4 rounded-xl bg-surface-elevated border border-border-subtle">
                                <div className="flex-1">
                                    <label className="text-sm font-medium text-text-secondary block mb-1">
                                        Upload Image
                                    </label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        disabled={isUploading}
                                        className="text-sm text-text-muted file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-accent-primary/10 file:text-accent-primary hover:file:bg-accent-primary/20 transition-all cursor-pointer"
                                    />
                                </div>
                                {isUploading && (
                                    <span className="text-sm text-accent-primary animate-pulse">Uploading...</span>
                                )}
                            </div>

                            {/* Tags */}
                            <div className="space-y-2">
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={tagInput}
                                        onChange={(e) => setTagInput(e.target.value)}
                                        onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTag())}
                                        placeholder="Add tag..."
                                        className="flex-1 px-4 py-2 rounded-xl bg-surface-secondary border border-border-subtle text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-primary transition-colors"
                                    />
                                    <button
                                        onClick={handleAddTag}
                                        className="px-4 py-2 rounded-xl bg-surface-elevated text-text-secondary hover:text-text-primary transition-colors"
                                    >
                                        Add
                                    </button>
                                </div>
                                {tags.length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                        {tags.map((tag) => (
                                            <span
                                                key={tag}
                                                className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-accent-primary/10 text-accent-primary text-sm"
                                            >
                                                #{tag}
                                                <button
                                                    onClick={() => handleRemoveTag(tag)}
                                                    className="hover:text-red-400 transition-colors"
                                                >
                                                    ×
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Content */}
                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="Write your content in Markdown..."
                                className="w-full h-[500px] px-4 py-3 rounded-xl bg-surface-secondary border border-border-subtle text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-primary transition-colors resize-none font-mono text-sm leading-relaxed"
                            />

                            {/* Markdown Tips */}
                            <div className="p-4 rounded-xl bg-surface-elevated text-sm text-text-muted">
                                <p className="font-medium text-text-secondary mb-2">Markdown Tips:</p>
                                <ul className="space-y-1">
                                    <li><code className="text-accent-primary">## Heading</code> for section titles</li>
                                    <li><code className="text-accent-primary">**bold**</code> for bold text</li>
                                    <li><code className="text-accent-primary">`code`</code> for inline code</li>
                                </ul>
                            </div>
                        </motion.div>

                        {/* Preview */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ ...springs.smooth, delay: 0.1 }}
                            className="space-y-4"
                        >
                            <h2 className="font-display font-semibold text-text-primary">Preview</h2>

                            <div className="p-6 rounded-2xl bg-surface-secondary border border-border-subtle min-h-[600px]">
                                {title ? (
                                    <h1 className="heading-display text-3xl mb-4">{title}</h1>
                                ) : (
                                    <p className="text-text-muted italic">Enter a title...</p>
                                )}

                                {category && (
                                    <span className="inline-block px-3 py-1 mb-4 text-sm font-medium rounded-full bg-accent-primary/10 text-accent-primary">
                                        {category}
                                    </span>
                                )}

                                {content ? (
                                    <div
                                        className="text-text-secondary prose prose-invert max-w-none"
                                        dangerouslySetInnerHTML={{ __html: renderPreview(content) }}
                                    />
                                ) : (
                                    <p className="text-text-muted italic">Start writing to see preview...</p>
                                )}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </main>
        </>
    );
}
