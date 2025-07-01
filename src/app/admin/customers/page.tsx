import { mockUsers } from "@/app/api/mock-userlist";
import ListUser from "./components/ListUser";

const users = mockUsers;

export default function CustomersPage() {

    return (
        <ListUser data={users} />
    );
}