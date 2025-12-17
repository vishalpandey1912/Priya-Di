const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://tfvkbxojijilnptvhsmb.supabase.co';
const serviceRoleKey = 'sb_secret_DklRWLe6-zPeaLB2JPZXIw_8xqNSsdA';

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function inspectOrders() {
    console.log('Inspecting "orders" table...');
    const { data, error } = await supabase.from('orders').select('*').limit(1);

    if (error) {
        console.error('Error:', error);
    } else {
        console.log('Success. Row sample:', data[0]);
    }
}

inspectOrders();
