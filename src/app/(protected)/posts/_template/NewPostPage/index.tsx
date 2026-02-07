"use client"

import Layout from "@/layout";
// import Layout from "@/components/Layout";
// import PostForm from "./components/PostForm";
import { usePostForm } from "./usePostForm";
import PostForm from "./components/PostForm";

const NewPostPage = () => {
    const formState = usePostForm();

    return (
        <Layout title="New Post" createBtn={false}>
            <PostForm formState={formState} />
        </Layout>
    );
};

export default NewPostPage;
