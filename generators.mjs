import uuid         from 'uuid';
import randomstring from 'randomstring';


export function randomUUID(){
	return uuid.v4();
}

export function randomString(qty_chars) {
	return randomstring.generate(qty_chars);
}

export function randomEnum(enum_entries, enum_entries_qty) {
	return enum_entries[Math.floor(Math.random() * enum_entries_qty)];
}

export function randomInteger(start, end) {
	return Math.floor((start + Math.random() * (end - start)));
}

export function randomValue(start, end, precision) {
	return Math.floor((start + Math.random() * (end - start)) * precision) / precision;
}

export function randomDate(start_time, end_time) {
	return Math.floor(start_time + Math.random() * (end_time - start_time));
}
