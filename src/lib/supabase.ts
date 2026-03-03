import { createClient } from '@supabase/supabase-js';

// Usando as chaves diretamente para o site voltar a carregar agora
const supabaseUrl = "https://qocxlyifwoopcobqqufl.supabase.co";
const supabaseAnonKey = "sb_publishable_FZd6lNHFNoMOz6CeBtrF_g_QCPsoImS";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);