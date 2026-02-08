// Script to manually apply the database migration
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://enjcslafqdwytxbtfync.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVuamNzbGFmcWR3eXR4YnRmeW5jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMyNDk3MjUsImV4cCI6MjA2ODgyNTcyNX0.blhte8pAPgSMd2uFxYt9fkMnWB34Y7JMfufy4fBtKQ4';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function applyMigration() {
    try {
        console.log('Applying database migration...');

        // Add default student user type
        const { data: userTypeData, error: userTypeError } = await supabase
            .from('user_types')
            .upsert({
                id: '550e8400-e29b-41d4-a716-446655440001',
                name: 'Student',
                description: 'Default role for students accessing the learning platform'
            }, { onConflict: 'name' });

        if (userTypeError) {
            console.error('Error creating user type:', userTypeError);
        } else {
            console.log('✅ Student user type created/updated');
        }

        console.log('Migration completed!');
        console.log('\nNext steps:');
        console.log('1. Go to Supabase Dashboard > Authentication > Providers > Google');
        console.log('2. Enable Google provider and add your OAuth credentials');
        console.log('3. Go to Authentication > Settings');
        console.log('4. Set Site URL to: http://localhost:8081');
        console.log('5. Add redirect URL: http://localhost:8081/auth/callback');

    } catch (error) {
        console.error('Migration failed:', error);
    }
}

applyMigration();
