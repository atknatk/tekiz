export class UsersTable {
	public static users: any = [
		{
			id: 1,
			username: '1',
			password: 'demo',
			email: 'admin@ticaret.gov.tr',
			accessToken: 'access-token-8f3ae836da744329a6f93bf20594b5cc',
			refreshToken: 'access-token-f8c137a2c98743f48b643e71161d90aa',
			roles: [1], // Administrator
			pic: './assets/media/users/default.jpg',
			fullname: 'Atakan Atik',
			occupation: 'Bilgi İşlem Dairesi',
			companyName: 'T.C. Ticaret Bakanlığı',
			phone: '+90 532 525 0000',

		},
		{
			id: 2,
			username: '2',
			password: 'demo',
			email: 'a.yapar@ticaret.gov.tr',
			accessToken: 'access-token-6829bba69dd3421d8762-991e9e806db1',
			refreshToken: 'access-token-f8e4c61a318e4d618b6c199ef96b9e51',
			roles: [3], // Manager
			pic: './assets/media/users/default.jpg',
			fullname: 'Ahmet Bayram',
			occupation: 'Bilgi İşlem Dairesi Uzman',
			companyName: 'T.C. Ticaret Bakanlığı',
			phone: '+90 532 525 0000'
        },
        {
			id: 3,
			username: '3',
			password: 'demo',
			email: 's.kibritoglu@ticaret.gov.tr',
			accessToken: 'access-token-6829bba69dd3421d8762-991e9e806db2',
			refreshToken: 'access-token-f8e4c61a318e4d618b6c199ef96b9e52',
			roles: [2], // Manager
			pic: './assets/media/users/default.jpg',
			fullname: 'Sultan Kibritoğlu',
			occupation: 'Bilgi İşlem / Yazılım Dairesi Başkanı',
			companyName: 'T.C. Ticaret Bakanlığı',
			phone: '+90 532 525 0000'
		},
		{
			id: 4,
			username: '4',
			password: 'demo',
			email: 'uzman@gsb.gov.tr',
			accessToken: 'access-token-6829bba69dd3421d8762-991e9e806db3',
			refreshToken: 'access-token-f8e4c61a318e4d618b6c199ef96b9e53',
			roles: [3], // Manager
			pic: './assets/media/users/default.jpg',
			fullname: 'GSB Sorumlu Uzman',
			occupation: 'Spor Hizmetleri Sorumlu Uzmanı',
			companyName: 'T.C. Gençlik ve Spor Bakanlığı',
			phone: '+90 532 525 0000'
        },
        {
			id: 5,
			username: '5',
			password: 'demo',
			email: 'm.baykan@gsb.gov.tr',
			accessToken: 'access-token-6829bba69dd3421d8762-991e9e806db4',
			refreshToken: 'access-token-f8e4c61a318e4d618b6c199ef96b9e54',
			roles: [2], // Manager
			pic: './assets/media/users/default.jpg',
			fullname: 'Mehmet Baykan',
			occupation: 'Spor Hizmetleri Sorumlu Başkanı',
			companyName: 'T.C. Gençlik ve Spor Bakanlığı',
			phone: '+90 532 525 0000'
		}
	];
	public static tokens: any = [
		{
			id: 1,
			accessToken: 'access-token-' + Math.random(),
			refreshToken: 'access-token-' + Math.random()
		}
	];
}
