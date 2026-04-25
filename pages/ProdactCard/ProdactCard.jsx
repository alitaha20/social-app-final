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
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
  User,
} from "@heroui/react";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useContext, useRef, useState } from "react";
import { AiFillLike } from "react-icons/ai";
import { FaComment, FaFile } from "react-icons/fa";
import { IoIosOptions, IoIosShareAlt } from "react-icons/io";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { authContext } from "../../contaxt/authContextPorvder";

export default function ProdactCard({ post, commetn }) {

  const { Token } = useContext(authContext);
  const newToken = jwtDecode(Token);

  const myInput = useRef();
  const textRef = useRef();
  const inputRef = useRef();

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [imageUrl, setImageUrl] = useState();

  const queryClient = useQueryClient();

  // create comment
  async function creatComment() {

    const content = myInput.current.value;

    const formData = new FormData();
    formData.append("content", content);

    return axios.post(
      `https://route-posts.routemisr.com/posts/${post._id}/comments`,
      formData,
      { headers: { token: Token } }
    );
  }

  // delete post
  function deletePost() {
    return axios.delete(
      `https://route-posts.routemisr.com/posts/${post.id}`,
      { headers: { token: Token } }
    );
  }

  // delete comment
  function deleteComment(commentId) {
    return axios.delete(
      `https://route-posts.routemisr.com/posts/${post.id}/comments/${commentId}`,
      { headers: { token: Token } }
    );
  }

  // preview image
  function changePreview() {

    const file = inputRef.current.files[0];

    if (!file) return;

    const url = URL.createObjectURL(file);

    setImageUrl(url);
  }

  function clearImage() {
    setImageUrl("");
    inputRef.current.value = "";
  }

  // update post
  function updatePost() {

    const text = textRef.current.value;
    const file = inputRef.current.files[0];

    const formData = new FormData();

    if (text) formData.append("body", text);

    if (file) formData.append("image", file);

    return axios.put(
      `https://route-posts.routemisr.com/posts/${post.id}`,
      formData,
      { headers: { token: Token } }
    );
  }

  // update mutation
  const { isPending: updatePending, mutate: mutateUpdate } = useMutation({
    mutationFn: updatePost,
    onSuccess: () => {

      toast.success("post updated", { position: "top-center" });

      queryClient.invalidateQueries(["firstposts"]);

      clearImage();

      onOpenChange(false);

      textRef.current.value = "";
    }
  });

  // delete post mutation
  const { isPending: deletePending, mutate: deleteMutate } = useMutation({
    mutationFn: deletePost,
    onSuccess: () => {

      toast.success("post deleted");

      queryClient.invalidateQueries(["firstposts"]);
    }
  });

  // create comment mutation
  const { isPending: commentPending, mutate } = useMutation({
    mutationFn: creatComment,
    onSuccess: () => {

      myInput.current.value = "";

      queryClient.invalidateQueries(["commentPost", post._id]);
    }
  });

  // delete comment mutation
  const deleteCommentMutation = useMutation({
    mutationFn: deleteComment,
    onSuccess: () => {

      toast.success("comment deleted");

      queryClient.invalidateQueries(["commentPost", post._id]);
    }
  });

  return (
    <>
      <Card className="mt-3 md:w-2/4 xs:w-full m-auto mb-3 ">

        <CardHeader className="justify-between">

          <div className="flex gap-5">

            <Avatar isBordered radius="full" size="md" src={post.user.photo} />

            <div>

              <h4 className="text-small font-semibold">
                {post.user.name}
              </h4>

              <Link to={`/PostDetils/${post.id}`}>
                <h5 className="text-small text-default-400">
                  {post.createdAt}
                </h5>
              </Link>

            </div>
          </div>

          {post.user._id == newToken.user && (

            <Dropdown>

              <DropdownTrigger>
                <Button variant="bordered">
                  <IoIosOptions />
                </Button>
              </DropdownTrigger>

              <DropdownMenu aria-label="post actions">

                <DropdownItem
                  key="edit"
                  textValue="edit post"
                  onPress={onOpen}
                >
                  Edit Post
                </DropdownItem>

                <DropdownItem
                  key="delete"
                  textValue="delete post"
                  color="danger"
                  className="text-danger"
                  onPress={deleteMutate}
                >
                  {deletePending ? "deleting..." : "Delete"}
                </DropdownItem>

              </DropdownMenu>

            </Dropdown>
          )}

        </CardHeader>

        <CardBody>

          {post.body && (
            <p className="font-bold pb-2">{post.body}</p>
          )}

          {post.image && (
            <img className="w-full" src={post.image} />
          )}

        </CardBody>

        <CardFooter className="flex-col w-full">

          <div className="flex justify-around w-full">

            <div className="flex items-center gap-1">
              <AiFillLike /> like
            </div>

            <div className="flex items-center gap-1">
              <FaComment /> comment
            </div>

            <div className="flex items-center gap-1">
              <IoIosShareAlt /> share
            </div>

          </div>

          {/* add comment */}

          <div className="w-full flex my-2 gap-2">

            <input
              ref={myInput}
              className="w-full bg-gray-300 rounded-2xl p-2"
              placeholder="add comment..."
            />

            <Button
              disabled={commentPending}
              onPress={mutate}
            >
              {commentPending ? "loading..." : "comment"}
            </Button>

          </div>

          {/* comments */}

          {commetn?.map((comment) => (

            <div
              key={comment._id}
              className="w-full flex justify-between bg-gray-200 p-2 rounded-lg my-2"
            >

              <div>

                <User
                  avatarProps={{
                    src: comment.commentCreator.photo
                  }}
                  name={comment.commentCreator.name}
                />

                <p className="bg-white rounded-xl px-3 py-1 mt-1">
                  {comment.content}
                </p>

              </div>

              {comment.commentCreator._id == newToken.user && (

                <Dropdown>

                  <DropdownTrigger>
                    <Button variant="light">
                      <IoIosOptions />
                    </Button>
                  </DropdownTrigger>

                  <DropdownMenu aria-label="comment actions">

                    <DropdownItem
                      key="delete"
                      textValue="delete comment"
                      color="danger"
                      onPress={() =>
                        deleteCommentMutation.mutate(comment._id)
                      }
                    >
                      Delete
                    </DropdownItem>

                  </DropdownMenu>

                </Dropdown>

              )}

            </div>

          ))}

        </CardFooter>

      </Card>

      {/* EDIT MODAL */}

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>

        <ModalContent>

          {(onClose) => (

            <>

              <ModalHeader>Edit Post</ModalHeader>

              <ModalBody>

                <textarea
                  ref={textRef}
                  className="border p-2 rounded-xl w-full"
                  placeholder="write a post..."
                />

                <input
                  type="file"
                  ref={inputRef}
                  onChange={changePreview}
                  className="hidden"
                  id="fileinput"
                />

                <label
                  htmlFor="fileinput"
                  className="bg-gray-300 p-2 rounded-lg cursor-pointer flex gap-2 w-fit"
                >
                  <FaFile /> select image
                </label>

                {imageUrl && (
                  <img
                    src={imageUrl}
                    className="w-1/2 m-auto"
                  />
                )}

              </ModalBody>

              <ModalFooter>

                <Button
                  color="danger"
                  variant="light"
                  onPress={onClose}
                >
                  close
                </Button>

                <Button
                  color="primary"
                  onPress={mutateUpdate}
                  disabled={updatePending}
                >
                  {updatePending ? "editing..." : "edit post"}
                </Button>

              </ModalFooter>

            </>
          )}

        </ModalContent>

      </Modal>

    </>
  );
}