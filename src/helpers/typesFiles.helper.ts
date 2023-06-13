export function typeFile(filename: any) {
    const index = filename.indexOf('.')
    return filename.slice(index)
}