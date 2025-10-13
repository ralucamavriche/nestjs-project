import { Injectable, NotAcceptableException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  private users = [
    { id: 1, name: 'Alice', email: 'alice@example.com', role: 'ADMIN' },
    { id: 2, name: 'Bob', email: 'bob@example.com', role: 'ENGINEER' },
    { id: 3, name: 'Charlie', email: 'charlie@example.com', role: 'INTERN' },
  ];

  findAll(role?: 'INTERN' | 'ENGINEER' | 'ADMIN') {
    if (role) {
      const roleArray = this.users.filter((user) => user.role === role);
      if (roleArray.length === 0) {
        throw new NotAcceptableException('User Role Not Found');
      }
      return roleArray;
    }
    return this.users;
  }

  findeOne(id: number) {
    const user = this.users.find((user) => user.id === id);
    if (!user) {
      throw new NotAcceptableException('User not found');
    }
    return user;
  }

  create(createUserDto: CreateUserDto) {
    const userByHighestId = [...this.users].sort((a, b) => b.id - a.id);
    const newUser = {
      id: userByHighestId[0].id + 1,
      ...createUserDto,
    };
    this.users.push(newUser);
    return newUser;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    {
      this.users = this.users.map((user) => {
        if (user.id === id) {
          return { ...user, ...updateUserDto };
        }
        return user;
      });
      return this.findeOne(id);
      //   const user = this.findeOne(id);
      //   if (!user) {
      //     return null;
      //   }
      //   const updatedUser = {
      //     ...user,
      //     ...updateUser,
      //   };
      //   const userIndex = this.users.findIndex((user) => user.id === id);
      //   this.users[userIndex] = updatedUser;

      //   return updatedUser;
    }
  }
  delete(id: number) {
    const removeUser = this.findeOne(id);
    this.users = this.users.filter((user) => user.id !== id);
    return removeUser;
  }
}
