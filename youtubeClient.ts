import { ChannelCompact, Client, VideoCompact } from 'youtubei';

const client = new Client();


const VIDEO_COMPACT = "VideoCompact"
const CHANNEL_COMPACT = "ChannelCompact"

const types = [VIDEO_COMPACT, CHANNEL_COMPACT]

export const searchYoutube = async (value: string) => {
	const results = await client.search(value).then((res) => {
		return res.filter(item => types.includes(item.constructor.name))
			.map(item => {
				if (item instanceof VideoCompact) return parseVideoCompact(item);
				if (item instanceof ChannelCompact) return parseChannelCompact(item);
			});
	})
	return results;
}
export const searchChannelVideos = async (channelId: string) => {
	const results = await client.getChannel(channelId).then(async channel => {
		return await channel?.nextVideos().then((res) =>
			res.map(item => parseVideoCompact(item))
		)
	})
	return results;
}


function parseVideoCompact(item: VideoCompact) {
	const title = item.title;
	const thumbnailURL = item.thumbnails.best;
	const viewCount = item.viewCount;
	const uploadDate = item.uploadDate;
	const videoId = item.id;

	const channelName = item.channel?.name;
	const channelAvatar = item.channel?.thumbnails?.best;
	const channelId = item.channel?.id;
	return {
		type: 'video',
		video: {
			id: videoId,
			title,
			thumbnailURL,
			viewCount,
			uploadDate,
		},
		channel: {
			id: channelId,
			name: channelName,
			avatarURL: channelAvatar,
		}
	}
}
function parseChannelCompact(item: ChannelCompact) {
	const channelName = item.name;
	const channelAvatar = item.thumbnails?.best;
	const subCount = item.subscriberCount
	const channelId = item.id;

	return {
		type: 'channel',
		channel: {
			id: channelId,
			name: channelName,
			avatarURL: channelAvatar,
			subCount,
		}
	}
}