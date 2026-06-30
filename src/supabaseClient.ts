import { createClient } from '@supabase/supabase-js';

// From your Supabase Project Settings -> API
const supabaseUrl = 'https://eqdihokpyyxuikwwkbra.supabase.co'; 


const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVxZGlob2tweXl4dWlrd3drYnJhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk3OTA1OTIsImV4cCI6MjA5NTM2NjU5Mn0.4I7DEJA0eJmOO_J1425btBgaZU_pdkWzH9_9RfXx0mo'; 

export const supabase = createClient(supabaseUrl, supabaseAnonKey);