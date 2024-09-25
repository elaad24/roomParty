import json

from api.views.sseView import clients_by_group, event_queue


# send event to the spesicif group
def send_event_to_group(room_key, event_type, data):
    if room_key in clients_by_group:
        message = json.dumps({"event_type": event_type, "data": data})
        for q in clients_by_group[room_key]:
            event_queue.put(message)
