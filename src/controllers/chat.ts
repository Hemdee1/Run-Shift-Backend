import { Request, Response } from "express";
import { PrismaClient, Chat } from "@prisma/client";

const prisma = new PrismaClient();

interface CreateChatRequest extends Request {
  body: {
    message: string;
    postId: string;
    staffId: string;
  };
}

interface GetChatByIdRequest extends Request {
  params: {
    id: string;
  };
}

interface GetChatsByPostRequest extends Request {
  params: {
    postId: string;
  };
}

interface DeleteChatRequest extends Request {
  params: {
    id: string;
  };
}

export const createChat = async (req: CreateChatRequest, res: Response): Promise<void> => {
  const { message, postId, staffId } = req.body;
  try {
    const chat: Chat = await prisma.chat.create({
      data: {
        message,
        postId,
        staffId,
      },
    });
    res.status(201).json(chat);
  } catch (error) {
    res.status(500).json({ error: "Error creating chat" });
  }
};

export const getChatsByPost = async (req: GetChatsByPostRequest, res: Response): Promise<void> => {
  const { postId } = req.params;
  try {
    const chats = await prisma.chat.findMany({
      where: {
        postId: postId,
      },
      include: {
        staff: true,
      },
    });
    res.status(200).json(chats);
  } catch (error) {
    res.status(500).json({ error: "Error fetching chats" });
  }
};

export const getChatById = async (req: GetChatByIdRequest, res: Response): Promise<void> => {
  const { id } = req.params;
  try {
    const chat = await prisma.chat.findUnique({
      where: {
        id: id,
      },
      include: {
        staff: true,
      },
    });
    if (chat) {
      res.status(200).json(chat);
    } else {
      res.status(404).json({ error: "Chat not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error fetching chat" });
  }
};

export const deleteChat = async (req: DeleteChatRequest, res: Response): Promise<void> => {
  const { id } = req.params;
  try {
    await prisma.chat.delete({
      where: {
        id: id,
      },
    });
    res.status(200).json({ message: "Chat deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting chat" });
  }
};
