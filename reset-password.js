const { createClient } = require('@supabase/supabase-js');

// Used from previous interaction
const supabaseUrl = 'https://tfvkbxojijilnptvhsmb.supabase.co';
const serviceRoleKey = 'sb_secret_DklRWLe6-zPeaLB2JPZXIw_8xqNSsdA';

const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

const TARGET_EMAIL = 'vishal.pandey1912@gmail.com';
const NEW_PASSWORD = 'admin123456';

async function resetPassword() {
    console.log(`Resetting password for ${TARGET_EMAIL}...`);

    // Find user first to get ID
    const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
    if (listError) {
        console.error('Error finding user:', listError);
        return;
    }

    const user = users.find(u => u.email === TARGET_EMAIL);
    if (!user) {
        console.error('User not found!');
        return;
    }

    // Update password
    const { data, error } = await supabase.auth.admin.updateUserById(
        user.id,
        { password: NEW_PASSWORD }
    );

    if (error) {
        console.error('Failed to reset password:', error);
    } else {
        console.log('Success! Password has been reset.');
        console.log(`Email: ${TARGET_EMAIL}`);
        console.log(`New Password: ${NEW_PASSWORD}`);
    }
}

resetPassword();
