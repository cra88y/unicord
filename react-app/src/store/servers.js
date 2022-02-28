const ADD_SERVER = "servers/ADD_SERVER";
const SET_SERVERS = "servers/ADD_SERVERS";
const REMOVE_SERVER = "servers/REMOVE_SERVER";

const SET_ACTIVE_SERVER = "servers/SET_ACTIVE_SERVER";
const SET_ACTIVE_CHANNEL = "servers/SET_ACTIVE_CHANNEL";

const addServer = (server) => ({
  type: ADD_SERVER,
  server,
});
const setServers = (servers) => ({
  type: SET_SERVERS,
  servers,
});
const removeServerById = (id) => ({
  type: REMOVE_SERVER,
  id: id,
});

const storeActiveServer = (server) => ({
  type: SET_ACTIVE_SERVER,
  server,
});
const storeActiveChannel = (channel) => ({
  type: SET_ACTIVE_CHANNEL,
  channel,
});

export const setActiveServer = (server) => async (dispatch) => {
  await dispatch(storeActiveServer(server));
};
export const setActiveChannel = (channel) => async (dispatch) => {
  await dispatch(storeActiveChannel(channel));
};

let isFetching = false;
export const loadUserServers = () => async (dispatch) => {
  console.log(isFetching);
  if (!isFetching) {
    isFetching = true;
    const response = await fetch(`/api/servers/joined`);
    if (response.ok) {
      const data = await response.json();
      if (Object.keys(data.servers) == 0) {
        isFetching = false;
        return false;
      }
      await dispatch(setServers(data.servers));
      isFetching = false;
      return data.servers;
    } else {
      isFetching = false;
      return false;
    }
  }
};
export const purgeServers = () => async (dispatch) => {
  await dispatch(setServers({}));
};
export const loadJoinableServers = () => async (dispatch) => {
  const response = await fetch(`/api/servers/joinable`);
  if (response.ok) {
    const data = await response.json();
    if (Object.keys(data.servers) == 0) return false;
    return data.servers;
  } else {
    return false;
  }
};
export const joinServerById = (id) => async (dispatch) => {
  const response = await fetch(`/api/servers/${id}/join`, {
    method: "POST",
  });

  if (response.ok) {
    const data = await response.json();
    await dispatch(addServer(data));
    await dispatch(storeActiveServer(data));
    return null;
  } else if (response.status < 500) {
    const data = await response.json();
    if (data.errors) {
      return data.errors;
    }
  } else {
    return ["An error occurred. Please try again."];
  }
};
export const leaveServerById = (id) => async (dispatch) => {
  const response = await fetch(`/api/servers/${id}/leave`, {
    method: "POST",
  });
  if (response.ok) {
    await dispatch(removeServerById(id));
    await dispatch(storeActiveServer(null));
    return null;
  } else {
    return ["An error occurred. Please try again."];
  }
};
export const deleteServerById = (id) => async (dispatch) => {
  const response = await fetch(`/api/servers/${id}`, {
    method: "DELETE",
  });

  if (response.ok) {
    await dispatch(removeServerById(id));
    await dispatch(setActiveServer(null));
    return null;
  } else {
    return ["An error occurred. Please try again."];
  }
};
export const editServer = (id, url, name) => async (dispatch) => {
  const response = await fetch(`/api/servers/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ url, name }),
  });
  if (response.ok) {
    const data = await response.json();
    await dispatch(addServer(data));
    await dispatch(storeActiveServer(data));
    return data;
  } else if (response.status < 500) {
    const data = await response.json();
    if (data.errors) {
      return data.errors;
    }
  } else {
    return ["An error occurred. Please try again."];
  }
};

export const createServer = (name, url) => async (dispatch) => {
  const response = await fetch("/api/servers/new", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, url }),
  });

  if (response.ok) {
    const data = await response.json();
    await dispatch(addServer(data));
    await dispatch(storeActiveServer(data));
    return null;
  } else if (response.status < 500) {
    const data = await response.json();
    if (data.errors) {
      return data.errors;
    }
  } else {
    return ["An error occurred. Please try again."];
  }
};

export const createChannel = (channel) => async (dispatch) => {
  const response = await fetch(`/api/channels/new`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(channel),
  });

  if (response.ok) {
    const data = await response.json();
    await dispatch(addServer(data));
    await dispatch(storeActiveServer(data));
    return null;
  } else if (response.status < 500) {
    const data = await response.json();
    if (data.errors) {
      return data.errors;
    }
  } else {
    return ["An error occurred. Please try again."];
  }
};
export const deleteChannelById = (id) => async (dispatch) => {
  const response = await fetch(`/api/channels/${id}`, {
    method: "DELETE",
  });

  if (response.ok) {
    const data = await response.json();
    await dispatch(addServer(data));
    return null;
  } else if (response.status < 500) {
    const data = await response.json();
    if (data.errors) {
      return data.errors;
    }
  } else {
    return ["An error occurred. Please try again."];
  }
};
export const editChannel = (channel) => async (dispatch) => {
  const response = await fetch(`/api/channels/${channel.id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(channel),
  });

  if (response.ok) {
    const data = await response.json();
    await dispatch(addServer(data));
    return null;
  } else if (response.status < 500) {
    const data = await response.json();
    if (data.errors) {
      return data.errors;
    }
  } else {
    return ["An error occurred. Please try again."];
  }
};

export const deleteChannelMessageById = (id) => async (dispatch) => {
  const response = await fetch(`/api/channels/messages/${id}`, {
    method: "DELETE",
  });

  if (response.ok) {
    const data = await response.json();
    await dispatch(addServer(data));
    return null;
  } else if (response.status < 500) {
    const data = await response.json();
    if (data.errors) {
      return data.errors;
    }
  } else {
    return ["An error occurred. Please try again."];
  }
};

export const updateChannelMessageById = (id, body) => async (dispatch) => {
  const response = await fetch(`/api/channels/messages`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id, body }),
  });
  if (response.ok) {
    const data = await response.json();
    return await data;
  } else if (response.status < 500) {
    const data = await response.json();
    if (data.errors) {
      return data.errors;
    }
  } else {
    return ["An error occurred. Please try again."];
  }
};
const initialState = { servers: {}, activeServer: null, activeChannel: null };
export default function reducer(state = initialState, action) {
  switch (action.type) {
    case ADD_SERVER:
      return {
        ...state,
        servers: { ...state.servers, [action.server.id]: action.server },
      };
    case SET_SERVERS:
      return { ...state, servers: { ...action.servers } };
    case REMOVE_SERVER:
      const newServers = { ...state.servers };
      delete newServers[action.id];
      return {
        ...state,
        servers: newServers,
      };
    case SET_ACTIVE_SERVER:
      return { ...state, activeServer: action.server };
    case SET_ACTIVE_CHANNEL:
      return { ...state, activeChannel: action.channel };
    default:
      return state;
  }
}
