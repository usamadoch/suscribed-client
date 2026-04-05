"use client"

import { usePostForm } from "./usePostForm";
import PostForm from "./components/PostForm";

const NewPostPage = () => {
    const formState = usePostForm();

    return (
        <PostForm formState={formState} />
    );
};

export default NewPostPage;
