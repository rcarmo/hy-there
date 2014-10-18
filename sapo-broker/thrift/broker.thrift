namespace java pt.com.broker.codec.thrift
namespace csharp SapoBrokerClient.Encoding.Thrift.Messages
namespace perl SAPO.Broker.Codecs.Autogen.Thrift


enum DestinationType
{
	TOPIC = 0;
	QUEUE = 1;
	VIRTUAL_QUEUE = 2;
}

enum ActionType
{
	PUBLISH = 0;
	POLL = 1;
	ACCEPTED = 2;
	ACKNOWLEDGE = 3;
	SUBSCRIBE = 4;
	UNSUBSCRIBE = 5;
	NOTIFICATION = 6;
	FAULT = 7;
	PING = 8;
	PONG = 9;
	AUTH = 10;
}

struct Header
{
	1: map<string, string> parameters;
}

struct BrokerMessage
{
	1: optional string message_id;
	2: binary payload;
	3: optional i64 expiration;
	4: optional i64 timestamp;
}

struct Publish
{
	1: optional string action_id;
	2: DestinationType destination_type;
	3: string destination;
	4: BrokerMessage message;
}

struct Poll
{
	1: optional string action_id;
	2: string destination;
	3: i64 timeout;
}

struct Accepted
{
	1: string action_id;
}

struct Acknowledge
{
	1: optional string action_id;
	2: string message_id;
	3: string destination;
}

struct Subscribe
{
	1: optional string action_id;
	2: string destination;
	3: DestinationType destination_type;
}

struct Unsubscribe
{
	1: optional string action_id;
	2: string destination;
	3: DestinationType destination_type;
}

struct Notification
{
	1: string destination;
	2: string subscription;
	3: DestinationType destination_type;
	4: BrokerMessage message;
}

struct Fault
{
	1: optional string action_id;
	2: string fault_code;
	3: string fault_message;
	4: optional string fault_detail;
}

struct Ping
{
	1: string action_id;
}

struct Pong
{
	1: string action_id;
}

struct Authentication
{
	1: optional string action_id;
	2: string authentication_type;
	3: binary token;
	4: optional string user_id;
	5: optional list<string> roles;		
}

struct Action
{				
	1: optional Publish publish;
	2: optional Poll poll;
	3: optional Accepted accepted;
	4: optional Acknowledge ack_message;
	5: optional Subscribe subscribe;
	6: optional Unsubscribe unsubscribe;
	7: optional Notification notification;
	8: optional Fault fault;
	9: optional Ping ping;
	10: optional Pong pong;
	11: optional Authentication auth;		
	12: ActionType action_type;
}

struct Atom
{	
	1: optional Header header;
	2: Action action;
}
