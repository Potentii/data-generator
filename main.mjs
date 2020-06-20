import Writer          from './writer';
import * as generators from './generators'



(async() => {
	
	// *The output file name:
	const output_file = './output/data.csv';

	// *Number of entries:
	// const entries = 100; // One hundred entries
	const entries = 1000000; // One million entries
	// const entries = 10000000; // Ten million entries

	// *Date values range:
	const start_date_time = new Date('2020-01-01 00:00:00').getTime();
	const end_date_time = new Date('2021-01-01 00:00:00').getTime();

	// *Enum values:
	const enum_entries = [
		'ABC', 'DEF', 'GHI', 'JKL', 'MNO', 'PQR', 'STU', 'VWX', 'YZA', 'BCD',
	];
	const enum_entries_qty = enum_entries.length;

	// *Numeric values range:
	const start_value = 1;
	const end_value = 999999;
	const precision = 100;
	
	
	// *Start the writer:
	await new Writer()
		
		// *Defining each entry:
		.dataProvider((i, is_last) => {
			return i + '\n';
		})
		
		// *Showing progess on console (comment for better performance):
		.onProgress(progress => {
			console.log(Math.round(progress*100) + '%');
		})
		
		// *Writing to the file:
		.write(output_file, entries);

	
	console.log('FINISHED');
	
})();