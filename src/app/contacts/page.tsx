import { Metadata } from "next";
import { ContactsPage } from "@/routes/contacts";

import { generatePageMetadata } from "@/utils/generatePageMetadata";

export async function generateMetadata(): Promise<Metadata> {
  return generatePageMetadata(
    "/contacts/",
    "Контакты | Семейный ресторан Рагу",
    "Контакты ресторана Рагу: адрес, телефон, время работы и как добраться"
  );
}

export default ContactsPage;