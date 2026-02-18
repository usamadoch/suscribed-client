"use client"

import { useHeader } from "@/context/HeaderContext";
import { usePostForm } from "./usePostForm";
import PostForm from "./components/PostForm";

const NewPostPage = () => {
    useHeader({ title: "New Post", createBtn: false });
    const formState = usePostForm();

    return (
        <PostForm formState={formState} />
    );
};

export default NewPostPage;
