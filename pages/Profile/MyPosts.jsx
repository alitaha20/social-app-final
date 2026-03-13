import {
  Avatar,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/react";
import { jwtDecode } from "jwt-decode";
import { useContext } from "react";
import { AiFillLike } from "react-icons/ai";
import { FaComment } from "react-icons/fa";
import { IoIosOptions, IoIosShareAlt } from "react-icons/io";
import { authContext } from "../../contaxt/authContextPorvder";
import {
  QueryClient,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "react-toastify";
import axios from "axios";

export default function MyPosts({ post }) {

  const queryClient = useQueryClient();

  const { Token } = useContext(authContext);
  const newToken = jwtDecode(Token);

  function deletePost() {
    return axios.delete(`https://route-posts.routemisr.com/posts/${post.id}`, {
      headers: {
        token: Token,
      },
    });
  }

  const { isPending: deletePending, mutate: deleteMutate } = useMutation({
    mutationFn: deletePost,
    onSuccess: (data) => {
      queryClient.invalidateQueries("firstposts");
      toast.success("delete done", {
        position: "top-center",
      });
    },
    onError: (error) => {
      console.log(error);
      toast.error("error");
    },
  });

  return (
    <>
      <Card className="  mt-3 w-full my-2  m-auto mb-3">
        <CardHeader className=" flex w-full">
          <div className="flex gap-5">
            <Avatar
              isBordered
              radius="full"
              size="md"
              src={post?.user?.photo}
            />
            <div className="flex w-full gap-1 items-start justify-between">
              
                <h4 className=" text-small font-semibold leading-none text-default-600"></h4>
                {post?.user?.name}
              <div>
                {post.user._id == newToken.user && (
                  <Dropdown>
                    <DropdownTrigger>
                      <Button variant="bordered">
                        <IoIosOptions />
                      </Button>
                    </DropdownTrigger>
                    <DropdownMenu aria-label="Example with disabled actions">
                      <DropdownItem key="edit">Edit file</DropdownItem>
                      <DropdownItem
                        key="delete"
                        disabled={deletePending}
                        onPress={deleteMutate}
                        className="text-danger"
                        color="danger"
                      >
                        {deletePending ? "deleting...." : "delete"}
                      </DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                )}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardBody className="w-full">
          {post.body ? <p className=" font-bold pb-2">{post.body}</p> : ""}
          {post.image && (
            <img className="w-full" src={post.image} alt={post.body} />
          )}
        </CardBody>

        <CardFooter className="flex-col w-full">
          <div className="flex justify-around w-full">
            <div className=" flex items-center">
              <span className="me-1">
                <AiFillLike />{" "}
              </span>
              <span>like</span>
            </div>
            <div className=" flex items-center">
              <span className="me-1">
                <FaComment />
              </span>
              <span>comment</span>
            </div>
            <div className=" flex items-center">
              <span className="me-1">
                <IoIosShareAlt />
              </span>
              <span>share</span>
            </div>
          </div>

          <div className=" w-full  flex my-2 gap-2">
            <input
              className="w-full bg-gray-300 rounded-2xl border-blue-500 p-2 "
              type="text"
              placeholder=" add comment ...."
            />
          </div>

          {post.topComment && (
            <div className="w-full bg-gray-200 rounded-lg font-bold flex justify-center items-center">
              <div className="w-full rounded-lg  m-2 font-bold">
                <User
                  className="ps-2 pb-0"
                  avatarProps={{
                    src: post.topComment.commentCreator.photo,
                  }}
                  name={post.topComment.commentCreator.name}
                />
                <p className=" ms-8 ps-15 pt-0 bg-white w-2/6 rounded-xl">
                  {post.topComment.content}
                </p>
              </div>

              <div>
                {post.user._id == newToken.user && (
                  <Dropdown>
                    <DropdownTrigger>
                      <Button variant="light" className=" bg-white">
                        <IoIosOptions />
                      </Button>
                    </DropdownTrigger>
                    <DropdownMenu aria-label="Example with disabled actions">
                      <DropdownItem key="edit">Edit file</DropdownItem>
                      <DropdownItem
                        key="delete"
                        className="text-danger"
                        color="danger"
                      >
                        Delete file
                      </DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                )}
              </div>
            </div>
          )}
        </CardFooter>
      </Card>
    </>
  );
}
