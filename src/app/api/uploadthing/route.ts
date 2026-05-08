import { createRouteHandler } from "uploadthing/next";
import { uploadRouter } from "./core";

const handlers = createRouteHandler({ router: uploadRouter });

export const GET = handlers.GET;
export const POST = handlers.POST;
