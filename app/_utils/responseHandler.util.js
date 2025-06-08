export const ReS = (message = "Success", data = {}, status = 200) => {
    return Response.json({
        success: true,
        message,
        data,
    },{status});
};

export const ReE = (message = "Error", error = null, status = 400) => {
    return Response.json({
        success: false,
        message,
        error
    },{status});
};
