import { kv } from '@vercel/kv';

export default async function handler(req, res) {
    // Permitir que cualquier PC acceda
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();

    try {
        if (req.method === 'GET') {
            const tasks = await kv.get('lista_tareas') || [];
            return res.status(200).json(tasks);
        }

        if (req.method === 'POST') {
            const { text } = req.body;
            if (!text) return res.status(400).json({ error: 'Falta el texto' });
            
            const tasks = await kv.get('lista_tareas') || [];
            const newTask = { id: Date.now().toString(), text };
            tasks.push(newTask);
            
            await kv.set('lista_tareas', tasks);
            return res.status(200).json(newTask);
        }

        if (req.method === 'DELETE') {
            const { id } = req.body;
            let tasks = await kv.get('lista_tareas') || [];
            tasks = tasks.filter(task => task.id !== id);
            
            await kv.set('lista_tareas', tasks);
            return res.status(200).json({ success: true });
        }
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
