export class PermissionsTable {
	public static permissions: any = [
		{
			id: 2,
			name: "accessToAuthModule",
			level: 1,
			title: "Kullanıcı Yönetimi Modülü",
		},
		{
			id: 7,
			name: "canReadAuthData",
			level: 2,
			parentId: 2,
			title: "Okuma",
		},
		{
			id: 8,
			name: "canEditAuthData",
			level: 2,
			parentId: 2,
			title: "Ekleme/Güncelleme",
		},
		{
			id: 9,
			name: "canDeleteAuthData",
			level: 2,
			parentId: 2,
			title: "Silme",
		},
		{
			id: 13,
			name: "accessToPlatformKunyeModule",
			level: 1,
			title: "Platform Künyesi Modülü",
		},
		{
			id: 14,
			name: "accessToEylemPlaniKunyeModule",
			level: 1,
			title: "Eylem Planı Künyesi Modülü",
		},
		{
			id: 15,
			name: "accessToEylemPlaniMaddeModule",
			level: 1,
			title: "Eylem Planı Maddeleri Modülü",
		},
		{
			id: 16,
			name: "canEditPlatformKunye",
			level: 2,
			parentId: 13,
			title: "Ekleme/Güncelleme",
		},
		{
			id: 17,
			name: "canReadPlatformKunye",
			level: 2,
			parentId: 13,
			title: "Görüntüleme",
		},
		{
			id: 24,
			name: "canDeletePlatformKunye",
			level: 2,
			parentId: 13,
			title: "Silme",
		},
		{
			id: 18,
			name: "canEditEylemPlaniKunye",
			level: 2,
			parentId: 14,
			title: "Ekleme/Güncelleme",
		},
		{
			id: 20,
			name: "canReadEylemPlaniKunye",
			level: 2,
			parentId: 14,
			title: "Görüntüleme",
		},
		{
			id: 25,
			name: "canDeleteEylemPlaniKunye",
			level: 2,
			parentId: 14,
			title: "Silme",
		},
		{
			id: 19,
			name: "canOnayEylemPlaniKunye",
			level: 2,
			parentId: 14,
            title: "Red / Onay",
		},
		{
			id: 21,
			name: "canEditEylemPlaniMadde",
			level: 2,
			parentId: 15,
			title: "Ekleme/Güncelleme",
		},
		{
			id: 22,
			name: "canReadEylemPlaniMadde",
			level: 2,
			parentId: 15,
			title: "Görüntüleme",
		},
		{
			id: 26,
			name: "canDeleteEylemPlaniMadde",
			level: 2,
			parentId: 15,
			title: "Silme",
		},
		{
			id: 23,
			name: "canOnayEylemPlaniMadde",
			level: 2,
			parentId: 15,
			title: "Red / Onay",
		},
	];
}
