import { Response } from 'express'
import { AuthenticatedReq } from '../../middlewares/auth'
import Blog from '../../models/blog.model'
import { LikesArr } from '../../types/likes'
import { Roles } from '../../types/enums'
import { Company } from '../../models/Company'

//Desc : get all  Blogs
//Route: GET /profile/api/v1/blog
export const getAllBlogs = async (req: AuthenticatedReq, res: Response) => {
  let blogs: any = []
  if (req.user?.role === Roles.ADMIN) {
    blogs = await Blog.find({ company: req.user.company }).populate([
      { path: 'user', model: "User" },
      {
        path: 'comments', model: "Comment",
        populate: [
          { path: 'user', model: "User" },
          { path: 'replys', model: "Comment" }
        ]
      },
    ])
  } else if (req.user?.role === Roles.ROOT) {
    // const compnies = (
    //   await Company.find({ owner: req.user?._id })
    // ).map((company) => company._id.toString())
    blogs = await Blog.find({ company: req.query.company }).populate([
      {
        path: 'comments',
        model: 'Comment',
        populate: [
          { path: 'user', model: 'User' },
          {
            path: 'replys',
            model: 'Comment',
            populate: {
              path: 'user',
              model: 'User',
            },
          },
        ],
      },
      {
        path: 'user',
        model: 'User',
      },
    ])
  } else if (req.user?.role === Roles.EMPLOYEE) {
    blogs = await Blog.find({ company: req.user.company }).populate([
      {
        path: 'comments',
        model: 'Comment',
        populate: [
          { path: 'user', model: 'User' },
          {
            path: 'replys',
            model: 'Comment',
            populate: {
              path: 'user',
              model: 'User',
            },
          },
        ],
      },
      {
        path: 'user',
        model: 'User',
      },
    ])
  }
  if (blogs.length <= 0) {
    return res
      .status(400)
      .send({ success: false, message_en: 'You do not have any blogs yet.' })
  }

  res.status(200).send({
    success: true,
    message_en: 'Blogs Are Fetched Successfully',
    cout: blogs.length,
    blogs,
  })
}

//Desc : Add Blog
//Route: POST /profile/api/v1/blog
export const addBlog = async (req: AuthenticatedReq, res: Response) => {
  //check if the blog is exist
  const user: any = req.user
  if (user.role === 'root') {
    if (!req.body.company && !user.company)
      return res.status(400).send({ error_en: 'Company is requierd ' })
    const compnies = (
      await Company.find({ owner: req.user?._id })
    ).map((company) => company._id.toString())
    if (
      !compnies.includes(
        req.body.company ? req.body.company : user.company.toString(),
      )
    )
      return res
        .status(400)
        .send({ message_en: 'You can not add any blog in this company' })
  }
  const blog = await Blog.findOne({ title: req.body.title })
  if (blog)
    return res
      .status(400)
      .send({ success: false, message_en: 'Blog Already Exist' })
  const newBlog = new Blog({
    ...req.body,
    user: req.user?._id,
    company: req.body.company ? req.body.company : req.user?.company,
  })
  await newBlog.save()
  const copyNewBlog = await Blog.findById(newBlog._id).populate([
    {
      path: 'comments',
      model: 'Comment',
      populate: [
        {
          path: 'replys',
          model: 'Comment',
          populate: {
            path: 'user',
            model: 'User',
          },
        },
        {
          path: 'user',
          model: 'User',
        },
      ],
    },
  ])
  res.status(200).send({
    success: true,
    message_en: 'Blog is Added Successfully',
    newBlog: copyNewBlog,
  })
}
//Desc : get my blogs
//Route: POST /profile/api/v1/blog/me
export const MyBlog = async (req: AuthenticatedReq, res: Response) => {
  //check if the blog is exist
  const user: any = req.user

  const myBlogs = await Blog.find({ user: user._id }).populate([

    { path: 'user', model: "User" },
    {
      path: 'comments', model: "Comment",
      populate: {
        path: "replys", model: "Comment",
        populate: { path: "user", model: "User" }
      }
    },
  ])
  res.status(200).send({
    success: true,
    newBlog: myBlogs,
  })
}
//Desc : get Blog
//Route: GET /profile/api/v1/blog/:id

export const getBlogById = async (req: AuthenticatedReq, res: Response) => {
  const { id } = req.params
  const blog = await Blog.findById(id).populate([
    { path: 'user', model: "User" },
    {
      path: 'comments', model: "Comment",
      populate: [
        { path: 'user', model: "User" },
        {
          path: 'replys', model: "Comment", populate: {
            path: 'user', model: "User"
          }
        }
      ]
    },
  ])

  if (!blog)
    return res
      .status(400)
      .send({ success: false, message_en: 'Blog is Not Found' })
  res
    .status(200)
    .send({ success: true, message_en: 'Blog is Fetched Successfully', blog })
}
//Desc : update Blog
//Route: PUT /profile/api/v1/blog/:id
export const updateBlog = async (req: AuthenticatedReq, res: Response) => {
  const { id } = req.params
  const blog = await Blog.findByIdAndUpdate(
    id,
    { ...req.body },
    { new: true },
  ).populate([
    { path: 'user', model: 'User' },
    {
      path: 'comments',
      model: 'Comment',
      populate: {
        path: 'replys',
        model: 'Comment',
        populate: {
          path: 'user',
          model: 'User',
        },
      },
    },
  ])
  if (!blog)
    return res
      .status(400)
      .send({ success: false, message_en: 'Blog is Not Found' })
  res
    .status(200)
    .send({ success: true, message_en: 'Blog updated Successfully', blog })
}

//Desc : delete Blog
//Route: DELTE /profile/api/v1/blog/:id
export const deleteBlog = async (req: AuthenticatedReq, res: Response) => {
  const { id } = req.params
  const blog = await Blog.findByIdAndDelete(id)
  if (!blog)
    return res
      .status(400)
      .send({ success: false, message_en: 'Blog is Not Found' })
  res
    .status(200)
    .send({ success: true, message_en: 'Blog Deleted Successfully' })
}

//DESC add user like to the blog : user can be any one not restriction required
//Route : PUT /profile/api/v1/blog/addLike/:blogId

export const addLike = async (req: AuthenticatedReq, res: Response) => {
  const userId: any = req.user?._id

  const { blogId } = req.params
  const { likeType } = req.body

  if (likeType) {
    if (!LikesArr.includes(likeType))
      return res
        .status(400)
        .send({ success: false, message_en: 'InValid Like Type' })
  } else {
    return res.status(400).send({
      success: false,
      message_en: 'You should add valid like type to add like on the blog',
    })
  }
  const foundUser: any = await Blog.findOne(
    { _id: blogId },
    { likes: { $elemMatch: { user: userId } } },
  )

  if (foundUser.likes[0]) {
    if (foundUser.likes[0].likeType === likeType) {
      await Blog.findByIdAndUpdate(
        { _id: blogId },
        { $pull: { likes: { user: userId, likeType: likeType } } },
        { new: true },
      )
      const blog = await Blog.findById(blogId).populate({
        path: 'comments',
        model: 'Comment',
        populate: [
          { path: 'user', model: 'User' },
          {
            path: 'replys',
            model: 'Comment',
            populate: {
              path: 'user',
              model: 'User',
            },
          },
        ],
      })
      return res.status(200).send({
        success: true,
        messsage_en: 'Like removed from the Blog Successfully',
        blog,
        toggling: true
      })
    } else if (foundUser.likes[0].likeType !== likeType) {
      await Blog.updateOne(
        { _id: blogId, 'likes.user': userId },
        { $set: { 'likes.$.likeType': likeType } },
        { new: true },
      )
      const blog = await Blog.findById(blogId).populate({
        path: 'comments',
        model: 'Comment',
        populate: [
          { path: 'user', model: 'User' },
          {
            path: 'replys',
            model: 'Comment',
            populate: {
              path: 'user',
              model: 'User',
            },
          },
        ],
      })

      return res.status(200).send({
        success: true,
        messsage_en: 'Like updated from the Blog Successfully',
        blog,
        toggling: false
      })
    }
  }
  // if (foundUser) {
  //   const blog = await Blog.updateOne(
  //     { _id: blogId },
  //     { $pull: { likes: { user: userId } } }
  //   );
  //   return res.status(200).send({
  //     success: true,
  //     messsage_en: "Like removed from the Blog Successfully",
  //     blog,
  //   });
  // }
  const data = { user: userId, likeType }

  const blog = await Blog.findByIdAndUpdate(
    blogId,
    {
      $push: { likes: data },
    },
    { new: true },
  )
  if (!blog)
    return res
      .status(400)
      .send({ success: false, message_en: 'Blog Not Found To Add Like To it' })
  const newBlog = await Blog.findById(blogId).populate({
    path: 'comments',
    model: 'Comment',
    populate: [
      { path: 'user', model: 'User' },
      {
        path: 'replys',
        model: 'Comment',
        populate: {
          path: 'user',
          model: 'User',
        },
      },
    ],
  })
  res.status(200).send({
    success: true,
    messsage_en: 'Like Added To the Blog Successfully',
    blog: newBlog,
    toggling: false
  })
}

//Desc remove like from the blog : any user can access the dislike endPoint
//Route : PUT/ profile/api/v1/blog/removeLike/:blogId

export const removeLike = async (req: AuthenticatedReq, res: Response) => {
  const userId: String | undefined = req.user?._id
  const { blogId } = req.params


  const blog = await Blog.updateOne(
    { _id: blogId },
    { $pull: { likes: userId } },
  )
  if (!blog) {
    return res
      .status(400)
      .send({ success: false, message_en: 'Blog Not Found To Add Like To it' })
  }
  res.status(200).send({
    success: true,
    messsage_en: 'Like removed from the Blog Successfully',
    blog,
  })
}
