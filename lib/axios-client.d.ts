export function get(url: any, callback: any, options?: {}): any;
export function getAsStream(url: any, callback: any, options?: {}): any;
export function passThroughLambdaEvent(url: any, event: any): Promise<{
    body: any;
    headers: any;
    statusCode: any;
}>;
export function post(args: any): any;
