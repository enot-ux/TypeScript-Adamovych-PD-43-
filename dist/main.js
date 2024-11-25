"use strict";
const canAccess = (role, action, resource) => {
    const rolePermissions = {
        admin: { create: true, read: true, update: true, delete: true },
        editor: { create: true, read: true, update: true, delete: false },
        viewer: { create: false, read: true, update: false, delete: false },
    };
    return rolePermissions[role][action];
};
const articleValidator = {
    validate: (data) => {
        const errors = [];
        if (!data.title || data.title.trim() === '') {
            errors.push('Title is required.');
        }
        if (!data.content || data.content.trim() === '') {
            errors.push('Content is required.');
        }
        return { isValid: errors.length === 0, errors };
    },
};
const versionControl = {
    createNewVersion: (content) => ({
        ...content,
        version: content.version
            ? content.version + 1
            : 1,
        previousVersions: [
            ...content.previousVersions || [],
            content,
        ],
    }),
    getPreviousVersions: (content) => content.previousVersions || [],
};
// Приклад використання
const articleOps = {
    create: (content) => ({
        ...content,
        id: 'unique-id',
        createdAt: new Date(),
        updatedAt: new Date(),
        status: 'draft',
    }),
    update: (id, changes) => ({
        ...changes,
        id,
        updatedAt: new Date(),
    }),
    delete: (id) => true,
    get: (id) => null,
    list: (filters) => [],
};
const article = articleOps.create({
    title: 'TypeScript CMS Design',
    content: 'This is a sample article.',
    author: 'Admin',
    tags: ['typescript', 'cms'],
    status: "draft"
});
const validated = articleValidator.validate(article);
console.log(validated);
const versionedArticle = versionControl.createNewVersion(article);
console.log(versionedArticle);
