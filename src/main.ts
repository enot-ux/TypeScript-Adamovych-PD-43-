// Базова структура для контенту
interface BaseContent {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    publishedAt?: Date;
    status: 'draft' | 'published' | 'archived';
  }
  
  interface Article extends BaseContent {
    title: string;
    content: string;
    author: string;
    tags?: string[];
  }
  
  interface Product extends BaseContent {
    name: string;
    description: string;
    price: number;
    inStock: boolean;
    category?: string;
  }
  
  type ContentOperations<T extends BaseContent> = {
    create: (content: Omit<T, 'id' | 'createdAt' | 'updatedAt'>) => T;
    update: (id: string, changes: Partial<T>) => T;
    delete: (id: string) => boolean;
    get: (id: string) => T | null;
    list: (filters?: Partial<T>) => T[];
  };
    
// Система прав доступу
  type Role = 'admin' | 'editor' | 'viewer';
  
  type Permission = {
    create: boolean;
    read: boolean;
    update: boolean;
    delete: boolean;
  };
  
  type AccessControl<T extends BaseContent> = {
    role: Role;
    permissions: Permission;
    resource: T;
  };
  
  type AccessCheck<T extends BaseContent> = (
    role: Role,
    action: keyof Permission,
    resource: T
  ) => boolean;
  
  const canAccess: AccessCheck<BaseContent> = (role, action, resource) => {
    const rolePermissions: Record<Role, Permission> = {
      admin: { create: true, read: true, update: true, delete: true },
      editor: { create: true, read: true, update: true, delete: false },
      viewer: { create: false, read: true, update: false, delete: false },
    };
  
    return rolePermissions[role][action];
  };
  
// Система валідації
  type Validator<T> = {
    validate: (data: T) => ValidationResult;
  };
  
  type ValidationResult = {
    isValid: boolean;
    errors?: string[];
  };
  
  const articleValidator: Validator<Article> = {
    validate: (data) => {
      const errors: string[] = [];
      if (!data.title || data.title.trim() === '') {
        errors.push('Title is required.');
      }
      if (!data.content || data.content.trim() === '') {
        errors.push('Content is required.');
      }
      return { isValid: errors.length === 0, errors };
    },
  };
  
// Система версіонування
  type Versioned<T extends BaseContent> = T & {
    version: number;
    previousVersions?: T[];
  };
  
  type VersionControl<T extends BaseContent> = {
    createNewVersion: (content: T) => Versioned<T>;
    getPreviousVersions: (content: Versioned<T>) => T[];
  };
  
  const versionControl: VersionControl<BaseContent> = {
    createNewVersion: (content) => ({
      ...content,
      version: (content as Versioned<BaseContent>).version
        ? (content as Versioned<BaseContent>).version + 1
        : 1,
      previousVersions: [
        ...(content as Versioned<BaseContent>).previousVersions || [],
        content,
      ],
    }),
    getPreviousVersions: (content) => content.previousVersions || [],
  };
  
// Приклад використання
  const articleOps: ContentOperations<Article> = {
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
    } as Article),
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
  