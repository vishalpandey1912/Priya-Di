const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://tfvkbxojijilnptvhsmb.supabase.co';
const serviceRoleKey = 'sb_secret_DklRWLe6-zPeaLB2JPZXIw_8xqNSsdA';

const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

async function confirmAllUsers() {
    console.log('Listing users...');
    const { data: { users }, error } = await supabase.auth.admin.listUsers();

    if (error) {
        console.error('Error listing users:', error);
        process.exit(1);
    }

    console.log(`Found ${users.length} users.`);

    for (const user of users) {
        if (!user.email_confirmed_at) {
            console.log(`Confirming email for ${user.email}...`);
            const { error: updateError } = await supabase.auth.admin.updateUserById(
                user.id,
                { email_confirm: true }
            );

            if (updateError) {
                console.error(`Failed to confirm ${user.email}:`, updateError);
            } else {
                console.log(`Successfully confirmed ${user.email}!`);
            }
        } else {
            console.log(`User ${user.email} is already confirmed.`);
        }
    }
    console.log('Done!');
}

confirmAllUsers();
