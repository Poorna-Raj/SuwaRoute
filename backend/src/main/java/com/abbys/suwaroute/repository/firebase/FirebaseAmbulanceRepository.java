package com.abbys.suwaroute.repository.firebase;

import com.abbys.suwaroute.model.ambulance.Ambulance;
import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.*;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
@Repository
public class FirebaseAmbulanceRepository implements AmbulanceRepository{
    private static final String COLLECTION = "ambulances";

    private final Firestore firestore;

    public FirebaseAmbulanceRepository(Firestore firestore) {
        this.firestore = firestore;
    }


    @Override
    public Ambulance save(Ambulance ambulance) throws Exception {
        ApiFuture<WriteResult> future = firestore
                .collection(COLLECTION)
                .document(ambulance.getAmbulanceId())
                .set(ambulance);
        future.get();
        return ambulance;
    }

    @Override
    public Ambulance findById(String id) throws Exception {
        DocumentReference documentReference = firestore
                .collection(COLLECTION)
                .document(id);
        DocumentSnapshot snapshot =
                documentReference.get().get();

        if(!snapshot.exists()){
            return null;
        }

        return snapshot.toObject(Ambulance.class);
    }

    @Override
    public List<Ambulance> findAll() throws Exception {
        ApiFuture<QuerySnapshot> future =
                firestore.collection(COLLECTION).get();

        List<QueryDocumentSnapshot> documents =
                future.get().getDocuments();

        List<Ambulance> ambulances = new ArrayList<>();

        for(QueryDocumentSnapshot document:documents){
            ambulances.add(document.toObject(Ambulance.class));
        }

        return ambulances;
    }

    @Override
    public Ambulance update(Ambulance ambulance) throws Exception {
        firestore.collection(COLLECTION)
                .document(ambulance.getAmbulanceId())
                .set(ambulance)
                .get();

        return ambulance;
    }

    @Override
    public void delete(String id) throws Exception {
        firestore.collection(COLLECTION)
                .document(id)
                .delete()
                .get();
    }
}
