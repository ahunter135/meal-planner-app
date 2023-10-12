import { Pipe, PipeTransform } from "@angular/core";
import { getDoc, getFirestore, doc } from "firebase/firestore";

@Pipe({
  name: "getUser",
})
export class GetUserPipe implements PipeTransform {
  async transform(value: string, ...args: unknown[]): Promise<unknown> {
    const userDoc = await getDoc(doc(getFirestore(), "users", value));

    return userDoc.data()["email"];
    return null;
  }
}
