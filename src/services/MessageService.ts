import { Message } from "../types";
import { BaseService } from "./BaseService";

export class MessageService extends BaseService {
    constructor() {
      super("https://localhost:5000/messages"); // mesaj servisin base URL'i
    }
  
    async sendMessage(message: Message): Promise<string> {
      return await this.post<string>("", message); // POST /api/messages
    }
  
    async getMessages(userId: number): Promise<Message[]> {
      return await this.get<Message[]>(`/${userId}`); // GET /api/messages/{userId}
    }
  }

export type { Message };
