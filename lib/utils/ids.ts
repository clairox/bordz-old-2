export const extractResourceId = (gid: string): string => {
	const gidSegments = gid.split('/')
	return gidSegments[gidSegments.length - 1]
}
