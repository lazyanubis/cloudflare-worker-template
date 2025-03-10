export { MyDurableObject } from './durable';

/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Bind resources to your worker in `wrangler.toml`. After adding bindings, a type definition for the
 * `Env` object can be regenerated with `npm run cf-typegen`.
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

export default {
    /**
     * This is the standard fetch handler for a Cloudflare Worker
     *
     * @param request - The request submitted to the Worker from the client
     * @param env - The interface to reference bindings declared in wrangler.jsonc
     * @param ctx - The execution context of the Worker
     * @returns The response to be sent back to the client
     */
    async fetch(request, env, ctx): Promise<Response> {
        // random durable object
        if (Math.random() < 0.5) {
            // We will create a `DurableObjectId` using the pathname from the Worker request
            // This id refers to a unique instance of our 'MyDurableObject' class above
            let id: DurableObjectId = env.MY_DURABLE_OBJECT.idFromName(new URL(request.url).pathname);

            // This stub creates a communication channel with the Durable Object instance
            // The Durable Object constructor will be invoked upon the first call for a given id
            let stub = env.MY_DURABLE_OBJECT.get(id);
            console.debug(`🚀 ~ fetch ~ stub:`, stub, typeof stub.sayHello);

            // We call the `sayHello()` RPC method on the stub to invoke the method on the remote
            // Durable Object instance
            let greeting = await stub.sayHello('world');

            return new Response(greeting);
        }

        return new Response('Hello World!');
    },

    // npx wrangler dev --test-scheduled
    // http://localhost:8787/__scheduled?cron=*+*+*+*+*
    // The scheduled handler is invoked at the interval set in our wrangler.jsonc's
    // [[triggers]] configuration.
    async scheduled(event, env, ctx): Promise<void> {
        console.log(`trigger fired at ${event.cron}`);
        // A Cron Trigger can make requests to other endpoints on the Internet,
        // publish to a Queue, query a D1 Database, and much more.
        //
        // We'll keep it simple and make an API call to a Cloudflare API:
        let resp = await fetch('https://api.cloudflare.com/client/v4/ips');
        let wasSuccessful = resp.ok ? 'success' : 'fail';

        // You could store this result in KV, write to a D1 Database, or publish to a Queue.
        // In this template, we'll just log the result:
        console.log(`trigger fired at ${event.cron}: ${wasSuccessful}`);
    },
} satisfies ExportedHandler<Env>;
