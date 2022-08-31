const getPaginatedStructureAndCount = (list, limit, page) => {
    try {
        const { count, rows: results } = list;
        const totalPages = Math.ceil(count / parseInt(limit));
        const cursors = {
            hasNextPage: parseInt(page) >= totalPages ? false : true,
            endCursor: parseInt(page) + 1,
            hasPreviousPage: parseInt(page) <= 1 ? false : true,
            startCursor: parseInt(page) - 1,
            totalPages
        };

        return { results, cursors };
    }
    catch (ex) {
        console.log(ex);
    }
};

const getOffset = (page, limit) => {
    try {
        const offset = (page - 1) * limit
        return { offset }
    }
    catch (ex) {
        console.log(ex);
    }
}

module.exports = {
    getPaginatedStructureAndCount,
    getOffset,
}