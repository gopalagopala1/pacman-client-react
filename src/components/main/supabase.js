import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://upmkwrmqxnywczhpitxq.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVwbWt3cm1xeG55d2N6aHBpdHhxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTcyMjUzNjYsImV4cCI6MjAzMjgwMTM2Nn0.YfpqRfWwyV4EaJP3MToJsXPEYdY1yXYWLPSL0cNygQU";

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
