import fs from 'fs'
import randomstring from 'randomstring'
import uuid from 'uuid'

// *File write stream:
const writable = fs.createWriteStream('./output/data.json');


// *Number of entries:
// const entries = 100; // One hundred entries
// const entries = 1000000; // One million entries
const entries = 10000000; // Ten million entries
const entries_minus_1 = entries-1;


// *Date values range:
const start_date_time = new Date('2020-01-01 00:00:00').getTime();
const end_date_time = new Date('2021-01-01 00:00:00').getTime();


// *Numeric values range:
const start_value = 1;
const end_value = 99999;
const precision = 100;


// *Enum values:
const enum_entries = [
	'ABC', 'DEF', 'GHI', 'JKL', 'MNO', 'PQR', 'STU', 'VWX', 'YZA', 'BCD', 
];
const enum_entries_qty = enum_entries.length;


writable.on('open', fd => {
	writable.write('[', 'utf8');
	
	for(let i=0; i<entries; i++){
		const obj_str = JSON.stringify({
			a: randomstring.generate(2),
			b: randomstring.generate(10),
			c: randomstring.generate(20),
			type: randomEnum(enum_entries, enum_entries_qty),
			value: randomValue(start_value, end_value, precision),
			date: new Date(randomDate(start_date_time, end_date_time)).toISOString(),
			uuid: uuid.v4(),
		});
		
		if(i===entries_minus_1)
			writable.write(obj_str, 'utf8');
		else
			writable.write(obj_str+',', 'utf8');
	}
	
	writable.write(']', 'utf8');
	writable.end();
});

function randomEnum(enum_entries, enum_entries_qty) {
	return enum_entries[Math.floor(Math.random() * enum_entries_qty)];
}

function randomValue(start, end, precision) {
	return Math.floor((start + Math.random() * (end - start)) * precision) / precision;
}

function randomDate(start_time, end_time) {
	return Math.floor(start_time + Math.random() * (end_time - start_time));
}
