export default {
  fetch(): Response {
    return new Response("Not Found", { status: 404 });
  },
};

