package com.abbys.suwaroute.repository.firebase;

import com.abbys.suwaroute.common.exception.DatabaseException;
import com.abbys.suwaroute.model.ambulance.Ambulance;
import com.abbys.suwaroute.model.emergency.Emergency;
import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.QueryDocumentSnapshot;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutionException;

@Repository
public class FirebaseEmergencyRepository implements EmergencyRepository {

    private static final String COLLECTION = "emergencies";

    private final Firestore firestore;

    public FirebaseEmergencyRepository(Firestore firestore) {
        this.firestore = firestore;
    }

    @Override
    public Emergency save(Emergency emergency) {
        try{
            firestore.collection(COLLECTION)
                    .document(emergency.getEmergencyId())
                    .set(emergency)
                    .get();
            return emergency;
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new DatabaseException("Database operation interrupted.", e);
        } catch (ExecutionException e) {
            throw new DatabaseException("Failed to save emergency.", e);
        }
    }

    @Override
    public Emergency findById(String id) {
        try {
            DocumentSnapshot snapshot = firestore
                    .collection(COLLECTION)
                    .document(id)
                    .get()
                    .get();

            if (!snapshot.exists()) {
                return null;
            }

            return snapshot.toObject(Emergency.class);

        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new DatabaseException("Database operation interrupted.", e);
        } catch (ExecutionException e) {
            throw new DatabaseException("Failed to retrieve emergency.", e);
        }
    }

    @Override
    public List<Emergency> findAll() {
        try {
            List<QueryDocumentSnapshot> documents = firestore
                    .collection(COLLECTION)
                    .get()
                    .get()
                    .getDocuments();

            List<Emergency> emergencies = new ArrayList<>();

            for (QueryDocumentSnapshot document : documents) {
                emergencies.add(document.toObject(Emergency.class));
            }

            return emergencies;

        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new DatabaseException("Database operation interrupted.", e);
        } catch (ExecutionException e) {
            throw new DatabaseException("Failed to retrieve emergencies.", e);
        }
    }

    @Override
    public Emergency update(Emergency emergency) {
        try {
            firestore.collection(COLLECTION)
                    .document(emergency.getEmergencyId())
                    .set(emergency)
                    .get();
            return emergency;

        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new DatabaseException("Database operation interrupted.", e);
        } catch (ExecutionException e) {
            throw new DatabaseException("Failed to update emergencies.", e);
        }
    }

    @Override
    public void delete(String id) {
        try {
            firestore.collection(COLLECTION)
                    .document(id)
                    .delete()
                    .get();

        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new DatabaseException("Database operation interrupted.", e);
        } catch (ExecutionException e) {
            throw new DatabaseException("Failed to delete emergency.", e);
        }
    }
}
