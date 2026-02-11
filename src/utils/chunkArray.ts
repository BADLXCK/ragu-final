export const chunkArray = <T>(array: T[], numberOfChunks: number): T[][] => {
    const chunkSize = Math.ceil(array.length / numberOfChunks);
    const chunkedArray: T[][] = [];

    for (let i = 0; i < numberOfChunks; i++) {
        chunkedArray.push(array.slice(i * chunkSize, (i + 1) * chunkSize));
    };

    return chunkedArray;
};