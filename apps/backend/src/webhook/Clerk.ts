import { Request, Response } from "express";
import { verifyWebhook } from "@clerk/backend/webhooks";
import { getEnv } from "../libs/env";
import { db } from "../db";
import { users } from "../db/Schema";
import { eq } from "drizzle-orm";

export const clerkWebHookMiddleware = async (req: Request, res: Response) => {
    const env = getEnv();
    if (!env.CLERK_WEBHOOK_SECRET) {
        console.error('CLERK_WEBHOOK_SECRET is not set in the environment variables');
        return res.status(500).json({ message: 'Invalid webhook secret' });
    }

    const payload = req.body instanceof Buffer ? req.body.toString('utf-8') : JSON.stringify(req.body);

    const request = new Request("http://internal/webhook/clerk", {
        method: req.method,
        headers: new Headers(req.headers as Record<string, string>),
        body: payload,
    });

    const evt = await verifyWebhook(request, { signingSecret: env.CLERK_WEBHOOK_SECRET });

    const evtType = evt.type;

    if (evtType === 'user.created' || evtType === 'user.updated') {
        console.log('User event received:', evtType, 'for user ID:', evt.data.id);
        const user = evt.data;
        const name = [user.first_name, user.last_name].filter(Boolean).join(' ') || user.username || 'Unknown';
        console.log('User name:', name);

        await db.insert(users).values({createdAt: new Date(), id: user.id}).onConflictDoUpdate({
            target: users.id,
            set: {
                createdAt: new Date(),
            },
        });
        console.log('User inserted/updated in the database:', user.id);
        return res.status(200).json({ message: 'User event processed successfully' });
    } else if (evtType === 'user.deleted') {
        console.log('User deleted event received for user ID:', evt.data.id);
        const userId = evt.data.id;
        if (!userId) {
            console.error('User deletion event missing user ID');
            return res.status(400).json({ message: 'User ID missing' });
        }
        await db.delete(users).where(eq(users.id, userId));
        console.log('User deleted from the database:', userId);
        return res.status(200).json({ message: 'User deleted successfully' });
    }
}