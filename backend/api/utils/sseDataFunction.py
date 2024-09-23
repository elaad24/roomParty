import json

from api.views.sseView import clients_by_group


# send event to the spesicif group
def send_event_to_group(room_key, event_type, data):
    if room_key in clients_by_group:
        for client in clients_by_group[room_key]:
            try:
                message = f"event: {event_type}\ndata: {json.dumps(data)}\n\n"
                client.wfile.write(message.encode("utf-8"))
                client.wfile.flush()
            except Exception as e:
                clients_by_group[room_key].remove(client)
