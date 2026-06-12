import { FastifyReply, FastifyRequest } from "fastify";
import * as ProductsService from "./products.service";

export async function getProducts(req: FastifyRequest, reply: FastifyReply) {
  const { search, category } = req.query as any;
  console.log(category, category, category, "category");
  const products = await ProductsService.findProducts({ search, category });
  return reply.send(products);
}

export async function getProductById(req: FastifyRequest, reply: FastifyReply) {
  const { id } = req.params as any;
  const product = await ProductsService.findProductById(id);
  return reply.send(product);
}

export async function createProduct(req: FastifyRequest, reply: FastifyReply) {
  const body = req.body as any;
  const product = await ProductsService.createNewProduct(body);
  return reply.send(product);
}

export async function updateProduct(
  req: FastifyRequest,
  reply: FastifyReply
) {
  const { id } = req.params as any;

  const data = req.body as any;

  const updatedProduct = await ProductsService.updateProduct(id, data);

  return reply.send({
    success: true,
    data: updatedProduct,
  });
}

export async function deleteProduct(req: FastifyRequest, reply: FastifyReply) {
  const { id } = req.params as any;

  const deletedProduct = await ProductsService.deleteProduct(id);

  return reply.send({
    success: true,
    data: deletedProduct,
  });
}
