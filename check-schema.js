const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://tfvkbxojijilnptvhsmb.supabase.co';
const serviceRoleKey = 'sb_secret_DklRWLe6-zPeaLB2JPZXIw_8xqNSsdA';

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function checkSchema() {
    console.log('Checking database schema...');

    const tables = ['profiles', 'orders', 'enrollments'];

    for (const table of tables) {
        const { error } = await supabase.from(table).select('id').limit(1);
        if (error) {
            console.log(`❌ Table '${table}' ERROR: ${error.message}`);
        } else {
            console.log(`✅ Table '${table}' exists.`);
        }
    }
}

checkSchema();
