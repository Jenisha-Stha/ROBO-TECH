// seed.ts

import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
        auth: { autoRefreshToken: false, persistSession: false },
    }
);

async function seed() {
    try {
        // 1. Insert User Types (Roles)
        const userTypes = [
            { name: 'Admin', description: 'Super admin role' },
            { name: 'Instructor', description: 'Course creator' },
            { name: 'Student', description: 'Learner role' },
            { name: 'Guest', description: 'Guest viewer' }
        ];

        const { data: insertedTypes, error: userTypeErr } = await supabase
            .from('user_types')
            .upsert(userTypes)
            .select();

        if (userTypeErr) throw userTypeErr;

        const adminType = insertedTypes.find((t) => t.name === 'Admin');
        if (!adminType) throw new Error('Admin user type not inserted');

        // 2. Create an Admin User in auth.users
        const adminEmail = 'admin@example.com';
        const adminPassword = 'SecurePassword123!';

        const { data: userData, error: signUpError } = await supabase.auth.admin.createUser({
            email: adminEmail,
            password: adminPassword,
            email_confirm: true,
        });

        if (signUpError) throw signUpError;

        const adminUser = userData.user;
        console.log(`✅ Created admin user: ${adminUser.id}`);

        // 3. Insert Profile for Admin
        const { error: profileErr } = await supabase.from('profiles').insert([
            {
                id: adminUser.id,
                full_name: 'Super Admin',
                avatar_url: '',
                user_type_id: adminType.id,
            }
        ]);

        if (profileErr) throw profileErr;

        console.log(`✅ Admin profile created successfully`);

        // 4. (Optional) Seed permissions & role_permissions
        const permissions = [
            {
                name: 'View Courses',
                slug: 'view_courses',
                description: 'Can view courses',
                resource: 'courses',
                action: 'read'
            },
            {
                name: 'Manage Courses',
                slug: 'manage_courses',
                description: 'Can create/edit/delete courses',
                resource: 'courses',
                action: 'write'
            }
        ];

        const { data: permData, error: permError } = await supabase
            .from('permissions')
            .upsert(permissions)
            .select();

        if (permError) throw permError;

        const rolePermissions = permData.map((perm) => ({
            permission_id: perm.id,
            user_type_id: adminType.id,
        }));

        const { error: rpError } = await supabase
            .from('role_permissions')
            .upsert(rolePermissions);

        if (rpError) throw rpError;

        console.log(`✅ Permissions & role_permissions seeded.`);

        console.log('🎉 Seeding complete!');
    } catch (err) {
        console.error('❌ Error during seeding:', err);
    }
}

seed();
