import { FastifyReply, FastifyRequest } from "fastify";
import { createOrderSchema } from "./orders.schema";
import * as OrdersService from "./orders.service";

export async function placeOrder(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const body = createOrderSchema.parse(request.body);

  const userId = request.user.id;

  const order = await OrdersService.createOrder(
    userId,
    body
  );

  return reply.status(201).send(order);
}



export async function getOrderById(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { id } = request.params as { id: string };

  const order = await OrdersService.getOrderById(id);
  console.log(order);
  return reply.send(order);
}

export async function getMyOrders(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const userId = request.user.id;

  const orders = await OrdersService.getMyOrders(userId);

  return reply.send(orders);
}

export async function getAllOrders(req: FastifyRequest, reply: FastifyReply) {
  const { status } = req.query as { status: string };
  const orders = await OrdersService.getAllOrders(status);
  return reply.send(orders);
}

export async function updateOrderStatus(req: FastifyRequest, reply: FastifyReply) {
  const { id } = req.params as { id: string };
  const order= await OrdersService.changeOrderStatus(id, req.body);
  return reply.send(order);
}