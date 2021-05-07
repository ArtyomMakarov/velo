export interface IMapElementFeature {
    type: string;
    properties: {
        name?: string;
        type?: 'route';
        order?: number;
        locations?: any;
        info?: string;
        image?: string;
        image_alt?: string;
    };
    geometry: {
        coordinates?: any[] | any[][] ;
        type?:  "Point" | "Polygon" | "LineString";
    };
    id: string;
}
