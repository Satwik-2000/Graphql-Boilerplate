import bcrypt from "bcryptjs";
import { EntityRepository, getRepository, Repository } from "typeorm";
import { User } from "../entity/User";
import { SignUpArgs } from "../types/User.type";

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  createNew = async (data: SignUpArgs): Promise<User> => {
    try {
      const { email, firstname, lastname, password, username } = data;
      const emailAvailability = await getRepository(User).count({ email });

      if (emailAvailability === 0) {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        const user = new User();
        user.email = email;
        user.password = hash;
        user.firstname = firstname;
        user.lastname = lastname;
        user.username = username;
        const addedUser = await getRepository(User).save(user);
        return addedUser;
      }
      throw new Error("Email already exist");
    } catch (err) {
      console.error(err);
      throw err;
    }
  };
}
