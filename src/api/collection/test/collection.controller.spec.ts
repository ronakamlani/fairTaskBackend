import { Test, TestingModule } from "@nestjs/testing";
import { CollectionController } from "../collection.controller";
import { Collection } from "../collection.entity";
import { CollectionService } from "../collection.service";


const collectionsData = [
    {
        id : Date.now(),
        name : "test",
        launchDate : new Date(),
        createdAt : new Date(),
        updatedAt : new Date(),
    },
    {
        id : Date.now(),
        name : "test",
        launchDate : null,
        createdAt : new Date(),
        updatedAt : new Date(),
    }
]

describe("CollectionController", ()=>{
    let collectionController:CollectionController;

    const mockCollectionService = {
        createCollection : jest.fn(dto=>{
            return {
                id : Date.now(),
                createdAt : new Date(),
                updatedAt : new Date(),
                ...dto,
            };
        }),

        getAllCollections: jest.fn( ()=>{
            return collectionsData
        }),

        getCollection : jest.fn( ()=>{
            return collectionsData[0];
        }),
    }

    beforeEach(async ()=>{
        const module:TestingModule = await Test.createTestingModule({
            controllers: [CollectionController],
            providers:[CollectionService]
        }).overrideProvider(CollectionService).useValue(mockCollectionService) .compile();

        collectionController = module.get<CollectionController>(CollectionController);
    })

    it("Should be defined",()=>{
        expect(collectionController).toBeDefined();
    });
    
    it("Should create a collection ",async ()=>{
        let c = new Collection();
        c.name = "Test";
        c.launchDate = null;
        let result = await collectionController.createCollection(c)
        expect(result.data.collection).toEqual({
            id: expect.any(Number),
            name : c.name,
            launchDate : c.launchDate,
            createdAt: expect.any(Date),
            updatedAt: expect.any(Date),
        });

        expect(mockCollectionService.createCollection).toHaveBeenCalledWith(c);
    });

    it("Should get all collections ",async ()=>{
        
        let result = await collectionController.getAllCollections()
        expect(result.data.collections).toEqual(collectionsData);

        expect(mockCollectionService.getAllCollections).toHaveBeenCalledWith();
    });

    it("Should get single collection ",async ()=>{
        
        let result = await collectionController.getCollection( collectionsData[0].id )
        expect(result.data.collection).toEqual(collectionsData[0]);

        expect(mockCollectionService.getCollection).toHaveBeenCalledWith(collectionsData[0].id);
    });

    

});