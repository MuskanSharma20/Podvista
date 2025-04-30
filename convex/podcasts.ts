import { ConvexError, v } from "convex/values";

import { mutation, query } from "./_generated/server";

// this mutation is required to generate the url after uploading the file to the storage.
export const getUrl = mutation({
    args: {
      storageId: v.id("_storage"),  // We expect an ID from the "_storage" table
    },
    handler: async (ctx, args) => {
      return await ctx.storage.getUrl(args.storageId);  // Use that ID to get a downloadable URL
    },  
  });
  
  export const createPodcast = mutation({
    args: {
      audioStorageId: v.id("_storage"),
      podcastTitle: v.string(),
      podcastDescription: v.string(),
      audioUrl: v.string(),
      imageUrl: v.string(),
      imageStorageId: v.id("_storage"),
      voicePrompt: v.string(),
      imagePrompt: v.string(),
      voiceType: v.string(),
      views: v.number(),
      audioDuration: v.number(),
    },
    handler: async (ctx, args) => {
      const identity = await ctx.auth.getUserIdentity();
  
      if (!identity) {
        throw new ConvexError("User not authenticated");
      }
  
      const user = await ctx.db
        .query("users")
        .filter((q) => q.eq(q.field("email"), identity.email))
        .collect();
  
      if (user.length === 0) {
        throw new ConvexError("User not found");
      }
  
      return await ctx.db.insert("podcasts", {
        audioStorageId: args.audioStorageId,
        user: user[0]._id,
        podcastTitle: args.podcastTitle,
        podcastDescription: args.podcastDescription,
        audioUrl: args.audioUrl,
        imageUrl: args.imageUrl,
        imageStorageId: args.imageStorageId,
        author: user[0].name,
        authorId: user[0].clerkId,
        voicePrompt: args.voicePrompt,
        imagePrompt: args.imagePrompt,
        voiceType: args.voiceType,
        views: args.views,
        authorImageUrl: user[0].imageUrl,
        audioDuration: args.audioDuration,
      });
    },
  });


  export const getTrendingPodcasts = query({
    handler: async (ctx) => {
      const podcast = await ctx.db.query("podcasts").collect();
  
      return podcast.sort((a, b) => b.views - a.views).slice(0, 8);
    },
  });

  // this query will get the podcast by the podcastId.
export const getPodcastById = query({
  args: {
    podcastId: v.id("podcasts"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.podcastId);
  },
});